/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");
const axios = require("axios");
const admin = require("firebase-admin");
const cors = require("cors")({origin: "https://gotok-ai.com"});
const stripe = require("stripe")(functions.config().stripe.secret);


admin.initializeApp();

const firestore = admin.firestore();


exports.generateConversationStarter = functions.
    https.onCall(async (data, context) => {
      const apiKey = functions.config().openai.key;
      const apiUrl = "https://api.openai.com/v1/chat/completions";

      const uid = context.auth.uid; // get user id from context

      // Get user document from Firestore
      const userDoc = await admin.firestore().collection("users").doc(uid)
          .get();

      // If the user document doesn't exist, return an error
      if (!userDoc.exists) {
        throw new functions.https.HttpsError("not-found", "User not found");
      }

      const userData = userDoc.data();

      // Check if the user has already generated 25 prompts today
      if (userData.apiCallCount >= 25 &&
      sameDay(userData.lastApiCall.toDate(), new Date())) {
        throw new functions
            .https.HttpsError(
                "resource-exhausted", "Reached your daily limit of 25 prompts");
      }

      // If the user hasn't generated a prompt today, reset apiCallCount to 0
      if (!sameDay(userData.lastApiCall.toDate(), new Date())) {
        userData.apiCallCount = 0;
      }

      const response = await axios.post(apiUrl, {
        model: "gpt-3.5-turbo",
        messages: [
          {"role": "system", "content": data.prompt},
          {"role": "user", "content": data.concatenatedString},
        ],
        max_tokens: 200,
        temperature: 0.7,
      }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "OpenAI-Organization": "org-Fj6flRfb4tQM5OXbBle6a2qX",
        },
      });

      // Increment the user's apiCallCount and update the lastApiCall date
      await admin.firestore().collection("users").doc(uid).update({
        apiCallCount: userData.apiCallCount + 1,
        lastApiCall: new Date(),
      });

      return response.data.choices[0].message.content;
    });
/**
 * Check if two dates fall on the same day
 *
 * @param {Date} d1 - The first date
 * @param {Date} d2 - The second date
 * @return {boolean} - Return true if the dates are on the same day
 */
function sameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}

exports.deleteUserByEmail = functions.https.onRequest((request, response) => {
  // Wrap your function logic with the cors function
  cors(request, response, async () => {
    try {
      if (request.method !== "POST") {
        response.status(400).send("Bad Request: Expected POST");
        return;
      }

      // Parse the request body
      const data = request.body;

      const email = data.email;
      const db = admin.firestore();

      // Get the user by email
      const userRecord = await admin.auth().getUserByEmail(email);

      // Delete the user's Firestore document
      await db.collection("users").doc(userRecord.uid).delete();

      // Delete the user from Firebase Auth
      await admin.auth().deleteUser(userRecord.uid);

      // Send a response
      response.json({success: true});
    } catch (error) {
      console.error("Error deleting user:", error);
      response.status(500).send(error);
    }
  });
});

exports.createCheckoutSession = functions.https.onCall(async (data, context)=> {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated",
        "You must be logged in to make a purchase.");
  }

  const uid = context.auth.uid;

  // Here you might look up any stored Stripe customer ID you have in Firestore
  // For this example, I'm assuming that you always create a new Stripe customer
  const userDoc = await firestore.collection("users").doc(uid).get();

  let customerId;

  if (userDoc.exists && userDoc.data().stripeCustomerId) {
    // Use the existing Stripe customer ID if found
    customerId = userDoc.data().stripeCustomerId;
  } else {
    // Otherwise, create a new Stripe customer and save to Firestore
    const customer = await stripe.customers.create({
      description: `Firebase UID: ${uid}`,
    });

    customerId = customer.id;

    // Store the new Stripe customer ID in Firestore
    await firestore.collection("users").doc(uid).set({
      stripeCustomerId: customerId,
    }, {merge: true});
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: 499, // e.g., 999 for $9.99
    currency: "usd",
    customer: customerId,
  });

  const ephemeralKey = await stripe.ephemeralKeys.create(
      {customer: customerId},
      {apiVersion: "2022-11-15"},
  );

  return {
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customerId,
  };
});

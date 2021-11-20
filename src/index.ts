// npm run lint -- --fix
// firebase deploy --only functions
import functions = require("firebase-functions");

import admin = require("firebase-admin");
admin.initializeApp();

// const db = admin.firestore();

/**
 * Triggered by a change to a Firestore document.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
exports.createDeviceLog = functions.region("southamerica-east1").firestore
    .document("{maybe}/{somedoc}/sections/{section}/devices/{device}")
    .onUpdate((change, context) => {
        const newValue = change.after.data();
        const previousValue = change.before.data();
        // ...or the previous value before this update
        if (newValue.value == previousValue.value) {
            return null;
        }
        // functions.logger.info("a", {structuredData: true});
        const ref = change.after.ref;
        return ref.collection("logs").add({
            "name": newValue.name,
            "type": newValue.type,
            "value": newValue.value,
            "time": admin.firestore.FieldValue.serverTimestamp,
        });
        // Get an object representing the document
        // e.g. {'name': 'Marie', 'age': 66};

        // db.doc('some/otherdoc').set({'name':newValue.name});
    });


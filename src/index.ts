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
exports.createDeviceLog = functions.firestore
    .document("{maybe}/{somedoc}/sections/{section}/devices/{device}")
    .onUpdate((change, context) => {
        const newValue = change.after.data();
        const previousValue = change.before.data();
        // ...or the previous value before this update
        if (newValue.value == previousValue.value) {
            return null;
        }
        functions.logger.info("name: " + newValue.name, {structuredData: true});
        const parent = change.after.ref.parent;
        return parent.add({
            "name": newValue.name,
            "type": newValue.type,
            "value": newValue.value,
            "time": admin.database.ServerValue.TIMESTAMP.toString(),
        });
        // Get an object representing the document
        // e.g. {'name': 'Marie', 'age': 66};

        // db.doc('some/otherdoc').set({'name':newValue.name});
    });


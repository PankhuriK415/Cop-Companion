/**
 * utils/hashPassword.js
 * Run: node utils/hashPassword.js <plaintext_password>
 * Generates a bcrypt hash you can insert directly into the login table.
 */

const bcrypt = require('bcryptjs');

const plaintext = process.argv[2];
if (!plaintext) {
  console.error('Usage: node utils/hashPassword.js <password>');
  process.exit(1);
}

(async () => {
  const hash = await bcrypt.hash(plaintext, 10);
  console.log('\nBcrypt Hash:');
  console.log(hash);
  console.log('\nSQL snippet:');
  console.log(`UPDATE login SET Password = '${hash}' WHERE Username = 'your_username';`);
})();

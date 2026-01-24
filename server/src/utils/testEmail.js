import "dotenv/config";
import { sendTestEmail } from './email.js';

await sendTestEmail();
process.exit(0);

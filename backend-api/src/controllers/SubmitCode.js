import axios from 'axios';
import findLanguageId from '../utils/languageById.js';

class SubmitCode {
  static async submissions(req, res) {
    const { submission, language, stdin } = req.body;
    const judgeURL = process.env.JUDGE0_URL;
    const languageId = findLanguageId(language);

    if (!languageId) {
      return res.status(400).json({ error: 'Invalid or unsupported language.' });
    }

    axios.post(`${judgeURL}/submissions?base64_encoded=true&wait=true`, {
      source_code: Buffer.from(submission).toString('base64'),
      language_id: languageId,
      stdin: stdin ? Buffer.from(stdin).toString('base64') : stdin
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        return res.status(200).json(response.data);
      })
      .catch((error) => {
        return res.status(400).json(error);
      })
  }
}

export default SubmitCode;

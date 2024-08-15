import axios from 'axios';

class FetchSubmissionResult {
  static async fetchSubmissionResult(req, res) {
    const { submissionId } = req.body;
    const judgeURL = process.env.JUDGE0_URL;

    if (!submissionId) {
      return res.status(400).json({ message: 'Submission ID is required.' });
    }

    const submissionResult = () => {
      axios.get(`${judgeURL}/submissions/${submissionId}`)
        .then((response) => {
          console.log(response.data);
          const { id } = response.data.status
          console.log(id);
          if (id === 1) {
            new Promise((resolve) => {
              setTimeout(() => {
                resolve(submissionResult);
              }, 20000);
            })
          }
          return res.status(200).send(payload);
        })
        .catch((error) => {
          return res.status(400).json(error);
        });
    }
    return submissionResult();
  }
}

export default FetchSubmissionResult;

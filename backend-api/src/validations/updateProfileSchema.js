import * as yup from 'yup';

const UpdateProfileSchema = yup.object({
  body: yup.object({
    bio:
      yup.string()
        .min(20, 'Your biography must be at least 20 characters long.')
        .max(200, 'Your biography must be at most 200 characters long.'),
    interests:
      yup.array()
        .of(yup.string('Interest must be a string.'))
        .min(1, 'At least one interest is required.')
        .max(5, 'Maximum of 5 interests allowed.')
        .required('At least one interest is required.'),
    githubLink:
      yup.string('GitHub profile link must be a string.')
        .url('Invalid link.')
        .matches(
          /^https:\/\/(www\.)?github\.com\/[a-zA-Z0-9-]+$/,
          'Invalid GitHub profile link.'
        ),
    xLink:
      yup.string('Twitter (X) profile link must be a string.')
        .url('Invalid link.')
        .matches(
          /^https:\/\/(www\.)?(twitter|x)\.com\/[a-zA-Z0-9_]+$/,
          'Invalid Twitter / X profile link.'
        ),
    linkedinLink:
      yup.string('LinkedIn profile link must be a string.')
        .url('Invalid link.')
        .matches(
          /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/,
          'Invalid LinkedIn profile link.'
        ),
  })
});

export default UpdateProfileSchema;

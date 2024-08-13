import * as yup from 'yup';

const maxImageSize = 256000; /** 250 KB */
const allowedImageTypes = ['jpeg', 'png', 'jpg'];

const RegistrationSchema = yup.object({
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
    profilePicture:
      yup.string('Profile picture must be a base64 encoded string.')
        .test('is-base64',
          'Profile picture must be a valid base64 encoded string.',
          (value) => {
            if (!value) return false;
            const regex = /^data:image\/(jpeg|png|jpg);base64,/;
            return regex.test(value);
          })
        .test('image-type',
          `Profile picture must be one of the following types: ${allowedImageTypes.join(', ')}.`,
          (value) => {
            if (!value) return false;
            const mimeType = value.split(';')[0].split('/')[1];
            return allowedImageTypes.includes(mimeType);
          })
        .test('image-size',
          `Profile picture must be smaller than ${maxImageSize / 1024} KB.`,
          (value) => {
            if (!value) return false;
            const base64String = value.split(',')[1];
            const imageSize = (base64String.length * (3 / 4)) - ((base64String.indexOf('=') > 0) ? (base64String.length - base64String.indexOf('=')) : 0);
            return imageSize <= maxImageSize;
          }),
    githubLink:
      yup.string('GitHub profil link must be a string.')
        .url('Invalid link.')
        .matches(
          /^https:\/\/(www\.)?github\.com\/[a-zA-Z0-9-]+$/,
          'Invalid GitHub profile link.'
        ),
    xLink:
      yup.string('Twitter (X) profil link must be a string.')
        .url('Invalid link.')
        .matches(
          /^https:\/\/(www\.)?(twitter|x)\.com\/[a-zA-Z0-9_]+$/,
          'Invalid Twitter / X profile link.'
        ),
    linkedinLink:
      yup.string('LinkedIn profil link must be a string.')
        .url('Invalid link.')
        .matches(
          /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/,
          'Invalid LinkedIn profile link.'
        ),
  })
});

export default RegistrationSchema;

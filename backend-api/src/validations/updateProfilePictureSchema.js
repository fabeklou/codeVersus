import * as yup from 'yup';

const UpdateProfilePictureSchema = yup.object({
  file: yup.mixed()
    .required('Profile picture is required.')
    .test('fileType', 'Only image files are allowed.',
      (value) => {
        return value && ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(value.mimetype);
      })
    .test('fileSize', 'File size is too large.',
      (value) => {
        return value && value.size <= 512000;
      })
});

export default UpdateProfilePictureSchema;

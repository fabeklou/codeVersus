import * as yup from 'yup';

const SnippetSchema = yup.object({
  body: yup.object({
    title:
      yup.string('Title must be a string.')
        .max(35, 'Title must be at most 35 characters.')
        .default('Untitled Snippet'),
    language:
      yup.string('Programming language name must be a string.')
        .max(15, 'Programming language name must be at most 15 characters.')
        .required('Programming language name is required.'),
    codeSnippet:
      yup.string('Code snippet must be a string.')
        .required('Code snippet is required.')
        .test('is-base64',
          'Code snippet must be a valid base64 encoded string.',
          (value) => {
            if (!value) return false;
            const base64Regex = /^[A-Za-z0-9+/=]+$/;
            return base64Regex.test(value);
          })
        .test('can-decode',
          'Code snippet must be decodable into UTF-8.',
          (value) => {
            if (!value) return false;
            try {
              const decoded = Buffer.from(value, 'base64').toString('utf-8');
              return decoded.length > 0;
            } catch (e) {
              return false;
            }
          }),
    description:
      yup.string('Description must be a string.')
        .max(200, 'Description must be at most 200 characters.'),
    isPublic:
      yup.boolean('isPublic must be a boolean.')
        .default(false),
    tags:
      yup.array()
        .of(yup.string('Tag must be a string.'))
        .min(1, 'At least one tag is required.')
        .max(5, 'Maximum of 5 tags allowed.')
        .test('unique-tags',
          'Tags must be unique.',
          (value) => {
            if (!value) return false;
            return value.length === new Set(value).size;
          }
        )
        .required('At least one tag is required.'),
  })
});

export default SnippetSchema;

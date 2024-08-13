/** supported Languages */
const supportedLanguages = [
  { 'id': 54, 'name': 'C++ (GCC 9.2.0)' },
  { 'id': 51, 'name': 'C# (Mono 6.6.0.161)' },
  { 'id': 60, 'name': 'Go (1.13.5)' },
  { 'id': 62, 'name': 'Java (OpenJDK 13.0.1)' },
  { 'id': 63, 'name': 'JavaScript (Node.js 12.14.0)' },
  { 'id': 68, 'name': 'PHP (7.4.1)' },
  { 'id': 71, 'name': 'Python (3.8.1)' },
];

const findLanguageId = (languageName) => {
  for (const language of supportedLanguages) {
    if (language.name.toLowerCase().startsWith(languageName.toLowerCase())) {
      return language.id;
    }
  }
  return null;
}

export default findLanguageId;

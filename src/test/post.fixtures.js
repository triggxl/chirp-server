// managing sample/test data for mock xss 
const makePostsArray = () => {
  return [
    {
      "id": "b0715efe-ffaf-11e8-8eb2-f2802f1b9fd1",
      "title": "Super",
      "content": "This is an XSS attack"
    },
    {
      "id": "b07161a6-ffaf-11e8-8eb2-f2901f1b9fd1",
      "title": "Important",
      "content": "This is an XSS attack"
    },
  ];
}

function makeMaliciousPost() {
  const makeMaliciousPost = {
    id: 911,
    title: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`
  }
  const expectedPost = {
    ...makeMaliciousPost,
    id: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    title: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`
  }
  return {
    makeMaliciousPost: makeMaliciousPost,
    expectedReply: expectedPost,
  }
}

module.exports = {
  makePostsArray: makePostsArray,
  makeMaliciousPost: makeMaliciousPost
}
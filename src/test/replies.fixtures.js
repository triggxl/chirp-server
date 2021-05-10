const makeRepliesArray = () => {
  return [
    {
      "id": "b0715efe-ffaf-11e8-8eb2-f2801f1b9fd1",
      "title": "Super",
      "content": "This is an XSS attack"
    },
    {
      "id": "b07161a6-ffaf-11e8-8eb2-f2801f1b9fd1",
      "title": "Important",
      "content": "This is an XSS attack"
    },
  ];
}

function makeMaliciousReply() {
  const maliciousReply = {
    id: 911,
    title: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`
  }
  const expectedReply = {
    ...maliciousReply,
    id: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    title: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`
  }
  return {
    maliciousFolder: maliciousReply,
    expectedFolder: expectedReply,
  }
}

module.exports = {
  makeFoldersArray: makeRepliesArray,
  makeMaliciousReply: makeMaliciousReply
}
const pool = require('./db/pool');

// 1. Get all bookmarks along with the username of the person who saved them.
//    Only bookmarks with a matching user are returned.
//    Return an array of objects. Each object should have: title, url, username.
const getAllBookmarksWithUsername = async () => {
    const { rows } = await pool.query('SELECT bookmarks.title, bookmarks.url, users.username FROM bookmarks INNER JOIN users ON users.user_id = bookmarks.user_id;');
    return rows;
};

// 2. Get all bookmarks saved by a specific user.
//    Return an array of objects. Each object should have: title, url, username.
const getBookmarksByUsername = async (username) => {
  const { rows } = await pool.query('SELECT bookmarks.title, bookmarks.url, users.username FROM bookmarks INNER JOIN users ON users.user_id = bookmarks.user_id WHERE users.username = $1',
    [username]
  );
  return rows;
};

// 3. Get all bookmarks that have at least one tag, along with the tag name.
//    A bookmark with two tags should appear twice (once per tag).
//    Return an array of objects. Each object should have: title, url, tag_name.
const getBookmarksWithAllTags = async () => {
  const { rows } = await pool.query('SELECT bookmarks.title, bookmarks.url, tags.name AS tag_name FROM bookmarks INNER JOIN bookmark_tags ON bookmarks.bookmark_id = bookmark_tags.bookmark_id INNER JOIN tags ON bookmark_tags.tag_id = tags.tag_id;');
  return rows;
};

// 4. Get all users and the total number of bookmarks they have saved.
//    Users with zero bookmarks are included (showing 0, not excluded).
//    Group by users.user_id and alias the count as total_bookmarks.
//    Return an array of objects. Each object should have: username, total_bookmarks.
const getUsersWithBookmarkCount = async () => {
  const { rows } = await pool.query('SELECT users.username, COUNT(bookmarks.user_id) AS total_bookmarks FROM users LEFT JOIN bookmarks ON users.user_id = bookmarks.user_id GROUP BY users.username;');
  return rows;
};

// 5. Get all bookmarks that have no tags.
//    Return an array of objects. Each object should have: title, url, username.
const getBookmarksWithNoTags = async () => {
  const { rows } = await pool.query('SELECT bookmarks.title, bookmarks.url, users.username FROM bookmarks LEFT JOIN users ON bookmarks.user_id = users.user_id LEFT JOIN bookmark_tags ON bookmarks.bookmark_id = bookmark_tags.bookmark_id GROUP BY bookmarks.title, bookmarks.url, users.username HAVING COUNT(bookmark_tags.tag_id) < 1;');
  return rows;
};

const main = async () => {
  console.log('--- 1. All Bookmarks With Username ---');
  console.log(await getAllBookmarksWithUsername());

  console.log('\n--- 2. Bookmarks by alice_j ---');
  console.log(await getBookmarksByUsername('alice_j'));

  console.log('\n--- 3. Bookmarks With All Tags ---');
  console.log(await getBookmarksWithAllTags());

  console.log('\n--- 4. Users With Bookmark Count ---');
  console.log(await getUsersWithBookmarkCount());

  console.log('\n--- 5. Bookmarks With No Tags ---');
  console.log(await getBookmarksWithNoTags());

  await pool.end();
};

main();

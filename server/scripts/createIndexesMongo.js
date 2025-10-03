import { MongoClient } from "mongodb";


async function createIndexes() {
  //no funciona esto: (ya lo hice y me funciono hardcodeando la uri)
  const client = await MongoClient.connect(process.env.MONGO_URI_WITH_DATABASE);
  const db = client.db();

  console.log('Creando índices...');

  // Posts
  await db.collection('posts').createIndex({ userId: 1, createdAt: -1 });
  await db.collection('posts').createIndex({ category: 1, createdAt: -1 });
  await db.collection('posts').createIndex({ createdAt: -1 });
  
  // Post Likes
  await db.collection('post_likes').createIndex(
    { postId: 1, userId: 1 }, 
    { unique: true }
  );
  await db.collection('post_likes').createIndex({ userId: 1, createdAt: -1 });
  
  // Post Comments
  await db.collection('post_comments').createIndex({ postId: 1, createdAt: -1 });
  await db.collection('post_comments').createIndex({ postId: 1, parentCommentId: 1, createdAt: -1 });
  await db.collection('post_comments').createIndex({ parentCommentId: 1 });
  
  // Post Comment Likes
  await db.collection('post_comment_likes').createIndex(
    { commentId: 1, userId: 1 }, 
    { unique: true }
  );
  await db.collection('post_comment_likes').createIndex({ commentId: 1 });

  console.log('✅ Índices creados');
  await client.close();
}

createIndexes().catch(console.error);
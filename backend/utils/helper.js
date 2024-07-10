import { ObjectId } from 'mongodb';

export function removeDuplicateObjectIDs(objectIDs) {
  let uniqueIDs = new Set();
  for (let id of objectIDs) {
      uniqueIDs.add(id.toString());
  }
  return Array.from(uniqueIDs).map(id => new ObjectId(id));
}
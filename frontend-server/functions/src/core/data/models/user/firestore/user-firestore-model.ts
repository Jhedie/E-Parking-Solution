import { firestore } from "firebase-admin";
import { User } from "../../../user";
import DocumentData = firestore.DocumentData;
import Timestamp = firestore.Timestamp;

/**
 * UserFirestoreModel is a class that extends the User class.
 * It provides static methods to create an instance from a User entity or an empty instance,
 * and instance methods to convert the instance to a DocumentData object for Firestore.
 *
 * The class also defines several static constants for the keys used in the DocumentData object.
 *
 * @extends {User}
 */
export class UserFirestoreModel extends User {
  static kUid = "uid";
  static kName = "name";
  static kRole = "role";
  static kEmail = "email";
  static kBirthDate = "birthDate";

  /**
   * Creates a UserFirestoreModel instance from a User entity.
   *
   * @param {User} entity - The User entity from which to create the UserFirestoreModel instance.
   * @returns {UserFirestoreModel} - The created UserFirestoreModel instance.
   */
  static fromEntity(entity: User): UserFirestoreModel {
    return Object.assign(UserFirestoreModel.empty(), entity);
  }

  /**
   * Creates an empty UserFirestoreModel instance.
   *
   * @returns {UserFirestoreModel} - The created empty UserFirestoreModel instance.
   */
  static empty(): UserFirestoreModel {
    return new UserFirestoreModel("", "", "" as any, "", new Date());
  }

  /**
   * Creates a UserFirestoreModel instance from a DocumentData object.
   *
   * @param {DocumentData} data - The DocumentData object from which to create the UserFirestoreModel instance.
   * @returns {UserFirestoreModel} - The created UserFirestoreModel instance.
   */
  static fromDocumentData(data: DocumentData): UserFirestoreModel {
    return new UserFirestoreModel(
      data[UserFirestoreModel.kUid],
      data[UserFirestoreModel.kName],
      data[UserFirestoreModel.kRole],
      data[UserFirestoreModel.kEmail],
      (data[UserFirestoreModel.kBirthDate] as Timestamp).toDate()
    );
  }
  /**
   * Converts the UserFirestoreModel instance to a DocumentData object.
   *
   * @returns {Object} - The DocumentData object.
   */
  toDocumentData(): object {
    return {
      [UserFirestoreModel.kUid]: this.uid,
      [UserFirestoreModel.kName]: this.name,
      [UserFirestoreModel.kRole]: this.role,
      [UserFirestoreModel.kEmail]: this.email,
      [UserFirestoreModel.kBirthDate]: this.birthDate,
    };
  }
}

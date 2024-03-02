import { User } from "../../../user";
import {
  validateUserBirthDate,
  validateUserEmail,
  validateUserName,
  validateUserPassword,
  validateUserRole,
} from "./validators";

/**
 * UserClientModel is a class that extends the User class.
 * It provides static methods to create an instance from a User entity or an empty instance,
 * and instance methods to convert the instance to a body object for requests.
 *
 * The class also defines several static constants for the keys used in the body object.
 *
 * @extends {User}
 */
export class UserClientModel extends User {
  static kUid = "uid";
  static kName = "name";
  static kRole = "role";
  static kEmail = "email";
  static kBirthDateMillisecondsSinceEpoch = "birthDateMillisecondsSinceEpoch";

  /** On request only: */
  static kPassword = "password";
  static kAdminKey = "adminKey";

  static fromEntity(entity: User): UserClientModel {
    return Object.assign(UserClientModel.empty(), entity);
  }

  static empty(): UserClientModel {
    return new UserClientModel("", "", "" as any, "", new Date());
  }

  /**
   * Converts the UserClientModel instance to a body object.
   * The body object includes the user's UID, name, role, email, and birth date.
   * The birth date is converted to milliseconds since the epoch.
   *
   * @returns {Object} The body object.
   */
  toBody(): object {
    return {
      [UserClientModel.kUid]: this.uid,
      [UserClientModel.kName]: this.name,
      [UserClientModel.kRole]: this.role,
      [UserClientModel.kEmail]: this.email,
      [UserClientModel.kBirthDateMillisecondsSinceEpoch]:
        this.birthDate.getTime(),
    };
  }

  /**
   * Creates a UserClientModel instance from a body object.
   * The body object should have properties for the user's name, role, email, birth date, and password.
   * The method validates these properties before creating the UserClientModel instance.
   * If the body object has a property for the admin key, it's included in the returned object.
   *
   * @param {any} body - The body object from which to create the UserClientModel instance.
   * @returns {UserClientModel & { password: string, adminKey?: string }} - The created UserClientModel instance.
   * @throws {Error} If any of the properties in the body object are invalid.
   */
  static fromBody(
    body: any
  ): UserClientModel & { password: string; adminKey?: string } {
    validateUserName(body[UserClientModel.kName]);
    validateUserEmail(body[UserClientModel.kEmail]);
    validateUserRole(body[UserClientModel.kRole]);
    validateUserBirthDate(
      body[UserClientModel.kBirthDateMillisecondsSinceEpoch]
    );
    validateUserPassword(body[UserClientModel.kPassword]);

    return Object.assign(
      new UserClientModel(
        null,
        body[UserClientModel.kName],
        body[UserClientModel.kRole],
        body[UserClientModel.kEmail],
        new Date(body[UserClientModel.kBirthDateMillisecondsSinceEpoch])
      ),
      {
        password: body[UserClientModel.kPassword],
        adminKey: body[UserClientModel.kAdminKey],
      }
    );
  }
}

import { HttpResponseError } from "../../../../utils/http-response-error";
import { validateEmail } from "../../../../utils/validators";

export function validateUserName(name: string) {
  if (!name?.length)
    throw new HttpResponseError(400, "BAD_REQUEST", 'Invalid "name"');
}

export function validateUserEmail(email: string) {
  if (!validateEmail(email))
    throw new HttpResponseError(400, "BAD_REQUEST", 'Invalid "email"');
}

export function validateUserPassword(password: string) {
  if (!password?.length || password.length < 6)
    throw new HttpResponseError(400, "BAD_REQUEST", 'Invalid "password"');
}

export function validateUserRole(role: string) {
  if (role != "parkingOwner" && role != "driver" && role != "admin")
    throw new HttpResponseError(
      400,
      "BAD_REQUEST",
      'Invalid "role", neither "parkingOwner", "driver" or "admin"'
    );
}

export function validateUserPhoneNumber(phoneNumber: string) {
  const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
  );
  const isValid = phoneRegex.test(phoneNumber);
  if (!isValid) {
    throw new HttpResponseError(400, "BAD_REQUEST", 'Invalid "phoneNumber"');
  }
}
// export function validateUserBirthDate(birthDateMillisecondsSinceEpoch: number) {
//   if (!birthDateMillisecondsSinceEpoch) {
//     throw new HttpResponseError(
//       400,
//       "BAD_REQUEST",
//       'Invalid "dateOfBirthTimestamp"'
//     );
//   }
//   if (getAge(new Date(birthDateMillisecondsSinceEpoch)) < 18) {
//     throw new HttpResponseError(400, "BAD_REQUEST", "User is underage");
//   }
// }

// function getAge(birthDate: Date) {
//   /** Source: https://stackoverflow.com/a/7091639/4508758 */
//   const today = new Date();
//   let age = today.getFullYear() - birthDate.getFullYear();
//   const m = today.getMonth() - birthDate.getMonth();
//   if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
//     age--;
//   }
//   return age;
// }

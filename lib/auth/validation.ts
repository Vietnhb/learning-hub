export const validateEmail = (email: string): string | null => {
  if (!email || email.trim().length === 0) {
    return "Email khong duoc de trong";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Email khong dung dinh dang";
  }

  if (email.length > 254) {
    return "Email qua dai (toi da 254 ky tu)";
  }

  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password || password.length === 0) {
    return "Mat khau khong duoc de trong";
  }

  if (password.length < 8) {
    return "Mat khau phai co it nhat 8 ky tu";
  }

  if (password.length > 72) {
    return "Mat khau qua dai (toi da 72 ky tu)";
  }

  if (!/[a-z]/.test(password)) {
    return "Mat khau phai co it nhat 1 chu thuong";
  }

  if (!/[A-Z]/.test(password)) {
    return "Mat khau phai co it nhat 1 chu hoa";
  }

  if (!/\d/.test(password)) {
    return "Mat khau phai co it nhat 1 chu so";
  }

  return null;
};

export const validateLoginPassword = (password: string): string | null => {
  if (!password || password.length === 0) {
    return "Mat khau khong duoc de trong";
  }

  if (password.length > 72) {
    return "Mat khau qua dai (toi da 72 ky tu)";
  }

  return null;
};

export const validateFullName = (name: string): string | null => {
  if (!name || name.trim().length === 0) {
    return "Ho va ten khong duoc de trong";
  }

  if (name.trim().length < 2) {
    return "Ho va ten phai co it nhat 2 ky tu";
  }

  return null;
};

export const validateDateOfBirth = (
  date: string,
  minAge: number = 13,
): string | null => {
  if (!date) {
    return "Ngay sinh khong duoc de trong";
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return "Ngay sinh phai dung dinh dang YYYY-MM-DD";
  }

  const birthDate = new Date(date);
  const today = new Date();

  if (Number.isNaN(birthDate.getTime())) {
    return "Ngay sinh khong hop le";
  }

  if (birthDate > today) {
    return "Ngay sinh khong the la ngay tuong lai";
  }

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  if (age < minAge) {
    return `Ban phai tu ${minAge} tuoi tro len`;
  }

  if (age > 120) {
    return "Ngay sinh khong hop le";
  }

  return null;
};

export const validateUserProfile = (data: {
  full_name: string;
  date_of_birth: string;
}): { isValid: boolean; errors: { [key: string]: string } } => {
  const errors: { [key: string]: string } = {};

  const nameError = validateFullName(data.full_name);
  if (nameError) errors.full_name = nameError;

  const dobError = validateDateOfBirth(data.date_of_birth);
  if (dobError) errors.date_of_birth = dobError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

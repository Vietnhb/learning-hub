export const validateFullName = (name: string): string | null => {
  if (!name || name.trim().length === 0) {
    return "Họ và tên không được để trống";
  }
  if (name.trim().length < 2) {
    return "Họ và tên phải có ít nhất 2 ký tự";
  }
  return null;
};

export const validateDateOfBirth = (
  date: string,
  minAge: number = 13,
): string | null => {
  if (!date) {
    return "Ngày sinh không được để trống";
  }

  // Kiểm tra format YYYY-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return "Ngày sinh phải đúng định dạng YYYY-MM-DD";
  }

  const birthDate = new Date(date);
  const today = new Date();

  // Kiểm tra ngày hợp lệ
  if (isNaN(birthDate.getTime())) {
    return "Ngày sinh không hợp lệ";
  }

  // Kiểm tra không phải ngày tương lai
  if (birthDate > today) {
    return "Ngày sinh không thể là ngày tương lai";
  }

  // Tính tuổi
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  if (age < minAge) {
    return `Bạn phải từ ${minAge} tuổi trở lên`;
  }

  if (age > 120) {
    return "Ngày sinh không hợp lệ";
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

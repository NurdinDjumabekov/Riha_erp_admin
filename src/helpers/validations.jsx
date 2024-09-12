export const validNums = (text) => {
  const isValid = /^[0-9.]*$/.test(text);
  return !isValid;
};

export const chechEmptyCount = (list) => {
  // Проверка, является ли count пустым или равным нулю
  return (
    list?.some(
      (item) =>
        (item?.count == "" && item?.is_checked) ||
        (item?.count == 0 && item?.is_checked)
    ) || false
  );
};

export const emptyCountCheck = (list) => {
  // Проверка, является ли count пустым или равным нулю
  return list?.some((item) => item?.count == "" || item?.count == 0) || false;
};

export const checkBoolFN = (list) => {
  // есть ли в массиве хотя бы один объект с ключом is_checked = true
  const hasCheckedItem = list?.some((item) => item?.is_checked === true);
  return !hasCheckedItem;
};

export const checkEditInputs = (list) => {
  const hasCheckedItem = list?.some((item) => item?.my_status === true);

  return hasCheckedItem;
};

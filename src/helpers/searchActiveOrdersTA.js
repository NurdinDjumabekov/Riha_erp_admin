export const searchActiveOrdersTA = (list) => {
  /// возвращаю массив с guid агентов, которые аrтивные на главной странице (bool = true)
  return list?.filter((i) => !!!i?.bool)?.map((i) => i?.guid) || [];
};

// export const searchActiveOrdersTA = (list) => {
//   /// возвращаю массив с guid агентов, которые аrтивные на главной странице (bool = true)
//   const asdas = list?.filter((i) => !!!i?.bool)?.map((i) => i?.guid) || [];
//   return [...asdas, "B3120F36-3FCD-4CA0-8346-484881974846"];
// };
// /// check

const getClassListString = (...classNames: (string | undefined)[]) => {
  return classNames.filter(Boolean).join(' ');
}

export {
  getClassListString
};
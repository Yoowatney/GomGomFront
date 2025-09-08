const handleShareLink = (link: string) => {
  navigator.clipboard
    .writeText(link)
    .then(() => {
      // setIsCopied(true);
      // EventTrigger({
      //   action: '링크 공유하기',
      //   category: 'share',
      //   label: '링크 공유하기',
      //   value: 1,
      // });
    })
    .catch((error) => {
      console.error('error', error);
    });
};

export { handleShareLink };

import { type ReactElement, useEffect, useRef, useState } from 'react';
import { MdOutlineHistory } from 'react-icons/md';
import { RiMenuLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

import { GOMGOM_HOMEPAGE_URL, GOMGOM_INSTA_URL } from '@/constant/url';
import { EventTrigger } from '@/util/ga-helper';

import Style from './style.module.scss';

const Header = (): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const dropdownOptions = [
    { label: '곰곰 다이어리 인스타그램', value: GOMGOM_INSTA_URL },
    { label: '곰곰 다이어리 홈페이지', value: GOMGOM_HOMEPAGE_URL },
  ];

  const handleOptionSelect = (value: string) => {
    if (value === GOMGOM_INSTA_URL) {
      EventTrigger({
        action: '인스타그램 이동',
        category: 'header_menu',
        label: '곰곰 다이어리 인스타그램',
        value: 1,
      });
    } else if (value === GOMGOM_HOMEPAGE_URL) {
      EventTrigger({
        action: '홈페이지 이동',
        category: 'header_menu',
        label: '곰곰 다이어리 홈페이지',
        value: 1,
      });
    }

    window.location.href = value;
    setIsOpen(false);
  };

  return (
    <div className={Style.Header} ref={dropdownRef}>
      <MdOutlineHistory
        className={Style.Icon}
        onClick={() => void navigate('/history')}
      />
      <div className={Style.Title} onClick={() => void navigate('/')}>
        GomGom Diary
      </div>
      <RiMenuLine className={Style.Icon} onClick={handleToggle} />
      {isOpen && (
        <ul className={Style.DropdownMenu}>
          {dropdownOptions.map((option) => (
            <li
              key={option.value}
              onClick={() => handleOptionSelect(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default Header;

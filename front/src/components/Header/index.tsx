import { type ReactElement, useEffect, useRef, useState } from 'react';
import { MdOutlineHistory } from 'react-icons/md';
import { RiMenuLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

import { GOMGOM_INSTA_URL } from '@/constant/url';
import { EventTrigger } from '@/util/ga-helper';

import Style from './style.module.scss';

interface DropdownOption {
  label: string;
  value: string;
  isExternal?: boolean;
}

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

  const dropdownOptions: DropdownOption[] = [
    { label: '서비스 소개', value: '/about' },
    { label: '자주 묻는 질문', value: '/faq' },
    { label: '곰곰 다이어리 인스타그램', value: GOMGOM_INSTA_URL, isExternal: true },
  ];

  const handleOptionSelect = (option: DropdownOption) => {
    if (option.isExternal) {
      EventTrigger({
        action: '인스타그램 이동',
        category: 'header_menu',
        label: '곰곰 다이어리 인스타그램',
        value: 1,
      });
      window.open(option.value, '_blank');
    } else {
      EventTrigger({
        action: `${option.label} 이동`,
        category: 'header_menu',
        label: option.label,
        value: 1,
      });
      void navigate(option.value);
    }
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
              onClick={() => handleOptionSelect(option)}
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

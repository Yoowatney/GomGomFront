import ReactGA from 'react-ga4';

interface Props {
  action: string;
  category: string;
  label: string;
  value: number;
}

export const EventTrigger = (props: Props) => {
  const { action, category, label, value } = props;

  ReactGA.event({
    action: action,
    category: category,
    label: label,
    value: value,
  });
};

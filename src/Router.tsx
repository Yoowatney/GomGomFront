import { createBrowserRouter } from 'react-router-dom';

import App from './App';
import About from './pages/About';
import Answerer from './pages/Answer/Answerer';
import Done from './pages/Answer/Done';
import MatchChallenge from './pages/Answer/MatchChallenge';
import WriteAnswer from './pages/Answer/WriteAnswer';
import Chat from './pages/Chat';
import Answer from './pages/Create/Answer';
import AnswerList from './pages/Create/AnswerList';
import Challenge from './pages/Create/Challenge';
import Countersign from './pages/Create/Countersign';
import Finish from './pages/Create/Finish';
import Question from './pages/Create/Question';
import QuestionerNum from './pages/Create/QuestionNum';
import Welcome from './pages/Create/Welcome';
import FAQ from './pages/FAQ';
import History from './pages/History';
import HistoryItem from './pages/History/HistoryItem';
import NotFound from './pages/NotFound/NotFound';
import Privacy from './pages/Privacy';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '', element: <Welcome /> },
      { path: 'questionNum', element: <QuestionerNum /> },
      { path: 'question', element: <Question /> },
      { path: 'challenge', element: <Challenge /> },
      { path: 'countersign', element: <Countersign /> },
      { path: 'finish', element: <Finish /> },
      { path: 'chat/enter_room', element: <Chat /> },

      { path: 'answerers/:diaryAddress', element: <AnswerList /> },

      { path: 'diary/:diaryAddress', element: <MatchChallenge /> },
      { path: 'diary/:diaryAddress/answerer', element: <Answerer /> },
      {
        path: 'diary/:diaryAddress/answer',
        element: <WriteAnswer />,
      },
      {
        path: 'done',
        element: <Done />,
      },
      {
        path: 'answer/:diaryAddress/:answererId',
        element: <Answer />,
      },
      { path: 'history', element: <History /> },
      { path: 'history/:historyItemId', element: <HistoryItem /> },
      { path: 'about', element: <About /> },
      { path: 'faq', element: <FAQ /> },
      { path: 'privacy', element: <Privacy /> },
    ],
  },
  // 404 페이지 - 광고 없음 (AdSense 정책 준수)
  {
    path: '*',
    element: <App showAd={false} />,
    children: [{ path: '*', element: <NotFound /> }],
  },
]);

export default router;

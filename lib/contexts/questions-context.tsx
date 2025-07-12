"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'sonner';

// Interfaces
interface User {
  id: string;
  name: string;
  avatar?: string;
  reputation: number;
}

interface Question {
  id: string;
  title: string;
  content: string;
  tags: string[];
  author: User;
  votes: number;
  answers: number;
  views: number;
  createdAt: string;
  hasAcceptedAnswer: boolean;
  userVote?: 'up' | 'down' | null;
}

interface Answer {
  id: string;
  questionId: string;
  content: string;
  author: User;
  votes: number;
  createdAt: string;
  isAccepted: boolean;
  userVote?: 'up' | 'down' | null;
  comments: Comment[];
}

interface Comment {
  id: string;
  answerId: string;
  content: string;
  author: User;
  createdAt: string;
}

interface QuestionsContextType {
  questions: Question[];
  answers: Answer[];
  addQuestion: (question: Omit<Question, 'id' | 'votes' | 'answers' | 'views' | 'createdAt' | 'hasAcceptedAnswer'>) => string;
  addAnswer: (answer: Omit<Answer, 'id' | 'votes' | 'createdAt' | 'isAccepted' | 'comments'>) => string;
  addComment: (comment: Omit<Comment, 'id' | 'createdAt'>) => string;
  voteQuestion: (questionId: string, voteType: 'up' | 'down') => void;
  voteAnswer: (answerId: string, voteType: 'up' | 'down') => void;
  acceptAnswer: (answerId: string) => void;
  getQuestionById: (id: string) => Question | undefined;
  getAnswersByQuestionId: (questionId: string) => Answer[];
  incrementViews: (questionId: string) => void;
  isLoading: boolean;
}

// Initial mock data
const initialQuestions: Question[] = [
  {
    id: '1',
    title: "How to implement authentication in Next.js 15 with App Router?",
    content: "I'm trying to implement authentication in my Next.js 15 application using the new App Router. What's the best approach for handling protected routes?",
    tags: ["nextjs", "authentication", "app-router", "react"],
    author: {
      id: '1',
      name: "Rahul Sharma",
      avatar: "/placeholder-avatar.jpg",
      reputation: 2450
    },
    votes: 42,
    answers: 8,
    views: 1250,
    createdAt: "2 hours ago",
    hasAcceptedAnswer: true
  },
  {
    id: '2',
    title: "TypeScript generic constraints with React components",
    content: "I'm struggling with TypeScript generic constraints when creating reusable React components. How can I properly type a component that accepts different prop types?",
    tags: ["typescript", "react", "generics", "components"],
    author: {
      id: '2',
      name: "Priya Patel",
      avatar: "/placeholder-avatar.jpg",
      reputation: 3200
    },
    votes: 28,
    answers: 5,
    views: 890,
    createdAt: "4 hours ago",
    hasAcceptedAnswer: false
  },
  {
    id: '3',
    title: "Best practices for state management in large React applications",
    content: "What are the current best practices for managing state in large React applications? Should I use Context API, Redux, or something else?",
    tags: ["react", "state-management", "redux", "context-api"],
    author: {
      id: '3',
      name: "Arjun Singh",
      avatar: "/placeholder-avatar.jpg",
      reputation: 1800
    },
    votes: 67,
    answers: 12,
    views: 2340,
    createdAt: "1 day ago",
    hasAcceptedAnswer: true
  }
];

const initialAnswers: Answer[] = [
  {
    id: '1',
    questionId: '1',
    content: `Great question! For Next.js 15 with App Router, I recommend using NextAuth.js v5 (Auth.js). Here's a complete setup:

## Installation

\`\`\`bash
npm install next-auth@beta
\`\`\`

## Configuration

Create \`auth.ts\` in your project root:

\`\`\`typescript
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
})
\`\`\`

This approach works perfectly with the App Router and provides excellent TypeScript support.`,
    author: {
      id: '4',
      name: "Priya Patel",
      avatar: "/placeholder-avatar.jpg",
      reputation: 8950
    },
    votes: 28,
    createdAt: "1 hour ago",
    isAccepted: true,
    comments: [
      {
        id: '1',
        answerId: '1',
        content: "This is exactly what I was looking for! The middleware approach is clean.",
        author: {
          id: '1',
          name: "Rahul Sharma",
          avatar: "/placeholder-avatar.jpg",
          reputation: 2450
        },
        createdAt: "45 minutes ago"
      }
    ]
  },
  {
    id: '2',
    questionId: '2',
    content: `Here's a comprehensive approach to TypeScript generic constraints with React components:

\`\`\`typescript
interface BaseProps {
  id: string;
  className?: string;
}

interface ButtonProps extends BaseProps {
  onClick: () => void;
  variant: 'primary' | 'secondary';
}

interface LinkProps extends BaseProps {
  href: string;
  target?: string;
}

type ComponentProps<T extends 'button' | 'link'> = T extends 'button' 
  ? ButtonProps 
  : T extends 'link' 
  ? LinkProps 
  : never;

function MyComponent<T extends 'button' | 'link'>(
  props: ComponentProps<T> & { type: T }
) {
  if (props.type === 'button') {
    return <button {...props} />;
  }
  return <a {...props} />;
}
\`\`\`

This pattern ensures type safety while maintaining flexibility.`,
    author: {
      id: '5',
      name: "Tech Expert",
      avatar: "/placeholder-avatar.jpg",
      reputation: 5200
    },
    votes: 15,
    createdAt: "2 hours ago",
    isAccepted: false,
    comments: []
  }
];

const QuestionsContext = createContext<QuestionsContextType | undefined>(undefined);

export const QuestionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedQuestions = localStorage.getItem('stackit_questions');
    const savedAnswers = localStorage.getItem('stackit_answers');
    
    if (savedQuestions) {
      try {
        setQuestions(JSON.parse(savedQuestions));
      } catch (error) {
        console.error('Error parsing saved questions:', error);
        setQuestions(initialQuestions);
      }
    } else {
      setQuestions(initialQuestions);
    }
    
    if (savedAnswers) {
      try {
        setAnswers(JSON.parse(savedAnswers));
      } catch (error) {
        console.error('Error parsing saved answers:', error);
        setAnswers(initialAnswers);
      }
    } else {
      setAnswers(initialAnswers);
    }
    
    setIsLoading(false);
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('stackit_questions', JSON.stringify(questions));
    }
  }, [questions, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('stackit_answers', JSON.stringify(answers));
    }
  }, [answers, isLoading]);

  const addQuestion = (questionData: Omit<Question, 'id' | 'votes' | 'answers' | 'views' | 'createdAt' | 'hasAcceptedAnswer'>) => {
    const newQuestion: Question = {
      ...questionData,
      id: Date.now().toString(),
      votes: 0,
      answers: 0,
      views: 0,
      createdAt: 'now',
      hasAcceptedAnswer: false
    };
    
    setQuestions(prev => [newQuestion, ...prev]);
    toast.success('Question posted successfully!');
    return newQuestion.id;
  };

  const addAnswer = (answerData: Omit<Answer, 'id' | 'votes' | 'createdAt' | 'isAccepted' | 'comments'>) => {
    const newAnswer: Answer = {
      ...answerData,
      id: Date.now().toString(),
      votes: 0,
      createdAt: 'now',
      isAccepted: false,
      comments: []
    };
    
    setAnswers(prev => [...prev, newAnswer]);
    
    // Update question answers count
    setQuestions(prev => prev.map(q => 
      q.id === answerData.questionId 
        ? { ...q, answers: q.answers + 1 }
        : q
    ));
    
    toast.success('Answer posted successfully!');
    return newAnswer.id;
  };

  const addComment = (commentData: Omit<Comment, 'id' | 'createdAt'>) => {
    const newComment: Comment = {
      ...commentData,
      id: Date.now().toString(),
      createdAt: 'now'
    };
    
    setAnswers(prev => prev.map(answer => 
      answer.id === commentData.answerId 
        ? { ...answer, comments: [...answer.comments, newComment] }
        : answer
    ));
    
    toast.success('Comment added successfully!');
    return newComment.id;
  };

  const voteQuestion = (questionId: string, voteType: 'up' | 'down') => {
    setQuestions(prev => prev.map(question => {
      if (question.id === questionId) {
        const currentVote = question.userVote;
        let newVotes = question.votes;
        let newUserVote: 'up' | 'down' | null = voteType;
        
        // Remove previous vote if exists
        if (currentVote === 'up') newVotes--;
        if (currentVote === 'down') newVotes++;
        
        // Add new vote
        if (voteType === 'up') {
          newVotes++;
          if (currentVote === 'up') {
            newUserVote = null;
            newVotes--;
          }
        } else {
          newVotes--;
          if (currentVote === 'down') {
            newUserVote = null;
            newVotes++;
          }
        }
        
        return { ...question, votes: newVotes, userVote: newUserVote };
      }
      return question;
    }));
    
    toast.success(`Question ${voteType}voted!`);
  };

  const voteAnswer = (answerId: string, voteType: 'up' | 'down') => {
    setAnswers(prev => prev.map(answer => {
      if (answer.id === answerId) {
        const currentVote = answer.userVote;
        let newVotes = answer.votes;
        let newUserVote: 'up' | 'down' | null = voteType;
        
        // Remove previous vote if exists
        if (currentVote === 'up') newVotes--;
        if (currentVote === 'down') newVotes++;
        
        // Add new vote
        if (voteType === 'up') {
          newVotes++;
          if (currentVote === 'up') {
            newUserVote = null;
            newVotes--;
          }
        } else {
          newVotes--;
          if (currentVote === 'down') {
            newUserVote = null;
            newVotes++;
          }
        }
        
        return { ...answer, votes: newVotes, userVote: newUserVote };
      }
      return answer;
    }));
    
    toast.success(`Answer ${voteType}voted!`);
  };

  const acceptAnswer = (answerId: string) => {
    const answer = answers.find(a => a.id === answerId);
    if (!answer) return;
    
    // Remove accepted status from other answers for this question
    setAnswers(prev => prev.map(a => 
      a.questionId === answer.questionId 
        ? { ...a, isAccepted: a.id === answerId ? !a.isAccepted : false }
        : a
    ));
    
    // Update question hasAcceptedAnswer status
    const hasAccepted = !answer.isAccepted;
    setQuestions(prev => prev.map(q => 
      q.id === answer.questionId 
        ? { ...q, hasAcceptedAnswer: hasAccepted }
        : q
    ));
    
    toast.success(hasAccepted ? 'Answer accepted!' : 'Answer unaccepted!');
  };

  const getQuestionById = (id: string) => {
    return questions.find(q => q.id === id);
  };

  const getAnswersByQuestionId = (questionId: string) => {
    return answers.filter(a => a.questionId === questionId);
  };

  const incrementViews = (questionId: string) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId 
        ? { ...q, views: q.views + 1 }
        : q
    ));
  };

  const value: QuestionsContextType = {
    questions,
    answers,
    addQuestion,
    addAnswer,
    addComment,
    voteQuestion,
    voteAnswer,
    acceptAnswer,
    getQuestionById,
    getAnswersByQuestionId,
    incrementViews,
    isLoading
  };

  return (
    <QuestionsContext.Provider value={value}>
      {children}
    </QuestionsContext.Provider>
  );
};

export const useQuestions = () => {
  const context = useContext(QuestionsContext);
  if (context === undefined) {
    throw new Error('useQuestions must be used within a QuestionsProvider');
  }
  return context;
}; 
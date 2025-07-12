import { Badge } from "@/components/ui/badge-component";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

interface Question {
  id: string;
  title: string;
  description: string;
  tags: string[];
  author: string;
  answers: number;
  score: number;
  createdAt: string;
}

interface QuestionCardProps {
  question: Question;
}

export function QuestionCard({ question }: QuestionCardProps) {
  const router = useRouter();
  
  const handleQuestionClick = () => {
    router.push(`/question/${question.id}`);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "now";
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="border-b border-border bg-card hover:bg-muted/20 transition-colors cursor-pointer" onClick={handleQuestionClick}>
      <div className="px-6 py-5">
        <div className="flex items-start gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-foreground leading-snug mb-2 hover:text-primary transition-colors">
              {question.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-normal mb-4 line-clamp-2">
              {question.description}
            </p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {question.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs font-normal">
                  {tag}
                </Badge>
              ))}
            </div>
            
            {/* Footer */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="" alt={question.author} />
                  <AvatarFallback className="text-xs">
                    {question.author.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{question.author}</span>
              </div>
              <span>{formatTimeAgo(question.createdAt)}</span>
            </div>
          </div>
          
          {/* Answer count */}
          <div className="text-center bg-muted/50 rounded-lg px-3 py-2 min-w-[60px]">
            <div className="text-lg font-semibold text-foreground">{question.answers}</div>
            <div className="text-xs text-muted-foreground">answers</div>
          </div>
        </div>
      </div>
    </div>
  );
}
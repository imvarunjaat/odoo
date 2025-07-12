import { Badge } from "@/components/ui/badge-component";

interface Question {
  id: string;
  title: string;
  description: string;
  tags: string[];
  author: string;
  answers: number;
  createdAt: string;
}

interface QuestionCardProps {
  question: Question;
}

export function QuestionCard({ question }: QuestionCardProps) {
  const truncateDescription = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-all duration-200">
      <div className="space-y-3">
        {/* Question Title */}
        <h3 className="text-lg font-semibold text-card-foreground hover:text-primary cursor-pointer line-clamp-2 transition-colors">
          {question.title}
        </h3>

        {/* Question Description */}
        <p className="text-muted-foreground text-sm leading-relaxed">
          {truncateDescription(question.description)}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {question.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Footer with author and answer count */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <span className="text-sm text-muted-foreground font-medium">{question.author}</span>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground font-medium">
              {question.answers} ans
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  linkTo: string;
  buttonText: string;
  isPrimary?: boolean;
}

const FeatureCard = ({ title, description, icon, linkTo, buttonText, isPrimary = false }: FeatureCardProps) => {
  return (
    <Card className={`card-hover border-2 ${isPrimary ? 'border-custom-purple-light' : 'border-gray-100'} transition-all hover:shadow-md`}>
      <CardHeader>
        <div className="h-12 w-12 rounded-full bg-custom-purple-light flex items-center justify-center mb-4">
          {icon}
        </div>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          asChild 
          className={`w-full ${isPrimary 
            ? 'bg-custom-purple-dark hover:bg-custom-purple-dark/90' 
            : 'bg-custom-purple hover:bg-custom-purple-dark'
          }`}
        >
          <Link to={linkTo}>{buttonText}</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;

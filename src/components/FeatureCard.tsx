
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
}

const FeatureCard = ({ title, description, icon, linkTo, buttonText }: FeatureCardProps) => {
  return (
    <Card className="card-hover border-2 border-gray-100">
      <CardHeader>
        <div className="h-12 w-12 rounded-full bg-custom-purple-light flex items-center justify-center mb-4">
          {icon}
        </div>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full bg-custom-purple hover:bg-custom-purple-dark">
          <Link to={linkTo}>{buttonText}</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;


import { ArrowDown, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const Hero = () => {
  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30 pt-20">
      <div className="container mx-auto px-4 text-center">
        <div className="animate-fade-in">
          <div className="mb-8">
            <Avatar className="w-32 h-32 mx-auto mb-6 ring-4 ring-primary/20">
              <AvatarImage 
                src="https://media.licdn.com/dms/image/v2/C4D03AQE-G9AK7mEMdA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1642986861985?e=1755129600&v=beta&t=0oKvqE4wr5ulU2e4sMRrFu4AIfKIr4CzinDlw5LXdFE"
                alt="Qurban Ali"
              />
              <AvatarFallback className="text-2xl font-bold">QA</AvatarFallback>
            </Avatar>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="gradient-text">Qurban Ali</span>
          </h1>
          <h2 className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Team Lead & Full Stack Developer
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Specializing in PHP (Laravel), React.js, Vue.js, Node.js, Express.js, Python and modern web technologies. 
            Building scalable applications with over 6 years of experience.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              onClick={scrollToAbout}
              className="text-lg px-8 py-6"
            >
              View My Work
              <ArrowDown className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-6"
            >
              Download Resume
              <Download className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <div className="animate-bounce">
            <button 
              onClick={scrollToAbout}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowDown className="h-8 w-8 mx-auto" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

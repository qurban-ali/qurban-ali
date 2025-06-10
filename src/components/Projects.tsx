
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const Projects = () => {
  const projects = [
    {
      title: "GerDentUSA",
      url: "https://www.gerdentusa.com/",
      description: "GerDentUSA manufactures and sells the finest dental surgical instruments. We have a wide range of oral surgery instruments for your dental practice.",
      technologies: ["PHP", "Laravel", "Web Development", "E-commerce"]
    },
    {
      title: "GerVetUSA",
      url: "https://www.gervetusa.com/",
      description: "GerVetUSA Inc. Manufactures and sells high quality German Forged surgical instruments which have been utilized with great success by the surgeons around the world for decades.",
      technologies: ["PHP", "Laravel", "Medical Industry", "Web Application"]
    },
    {
      title: "helloFriday",
      url: "https://www.hellofriday.io/",
      description: "hellofriday is a flexible HR platform that helps your organization build people-centric work culture, give voice to employees, and get business results.",
      technologies: ["HR Platform", "Web Development", "Business Application"]
    }
  ];

  return (
    <section id="projects" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Featured Projects</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-8"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Showcasing successful web applications and platforms I've contributed to
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-primary">{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, techIndex) => (
                      <span 
                        key={techIndex} 
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => window.open(project.url, '_blank')}
                  >
                    Visit Project
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;

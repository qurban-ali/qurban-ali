
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const Projects = () => {
  const projects = [
    {
      title: "GerDentUSA",
      url: "https://www.gerdentusa.com/",
      description: "GerDentUSA manufactures and sells the finest dental surgical instruments. We have a wide range of oral surgery instruments for your dental practice.",
      technologies: ["PHP", "Laravel", "Livewire"]
    },
    {
      title: "GerVetUSA",
      url: "https://www.gervetusa.com/",
      description: "GerVetUSA Inc. Manufactures and sells high quality German Forged surgical instruments which have been utilized with great success by the surgeons around the world for decades.",
      technologies: ["PHP", "Laravel", "Next Js"]
    },
    {
      title: "iShopEco",
      url: "https://www.ishopeco.com/",
      description: "An e-commerce platform focused on eco-friendly products, built with Quasar Framework (Vue.js) for a responsive frontend and Laravel backend. The platform provides a seamless shopping experience for environmentally conscious consumers.",
      technologies: ["Vue.js", "Quasar Framework", "Laravel"]
    },
    {
      title: "ZenBench",
      url: "https://www.zenbench.io/",
      description: "An enterprise platform enhancing Zendesk functionality with advanced tools for automation, data management, and customization. Built with Vue.js frontend and Laravel backend, featuring data deduplication, custom object modeling, and a marketplace for data models.",
      technologies: ["Vue.js", "Laravel", "Inertia"]
    },
    {
      title: "ToolsZip",
      url: "https://toolszip.com/",
      description: "A comprehensive platform offering a suite of online tools including PDF management, image converters, development aids, SEO tools, and more. Built with a JavaScript frontend and Laravel backend for optimal performance and user experience.",
      technologies: ["Vue.js", "Laravel", "Inertia"]
    },
    {
      title: "helloFriday",
      url: "https://www.hellofriday.io/",
      description: "hellofriday is a flexible HR platform that helps your organization build people-centric work culture, give voice to employees, and get business results.",
      technologies: ["React.js", "Laravel", "Inertia", "Flask", "CorePHP", "Express Js"]
    },
    {
      title: "TalentVista",
      url: "https://talentvista.ai/",
      description: "An AI-powered aviation recruitment platform that revolutionizes hiring through intelligent CV parsing, skills-based screening, and role-specific recommendations. Trained on extensive aviation data for precise candidate matching.",
      technologies: ["React.js", "Laravel", "Inertia", "Fast API", "AI/ML"]
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

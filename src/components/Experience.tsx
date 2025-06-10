
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Calendar } from 'lucide-react';

const Experience = () => {
  const experiences = [
    {
      title: "Team Lead & Full Stack Developer",
      company: "Friday Media Group Pakistan",
      location: "Lahore, Pakistan",
      period: "Jun 2022 - Present",
      description: "Leading development teams in building comprehensive web solutions using PHP (Laravel) and React.js. Focusing on scalable applications and team collaboration.",
      technologies: ["PHP", "Laravel", "React.js", "Team Leadership", "Project Management"]
    },
    {
      title: "Team Lead & Full Stack Developer",
      company: "Catalyic Tech",
      location: "Lahore, Pakistan",
      period: "Aug 2020 - May 2022",
      description: "Specialized in PHP (Laravel) and Vue.js development while leading development initiatives and empowering team members to excel in complex projects.",
      technologies: ["PHP", "Laravel", "Vue.js", "Full Stack Development", "Team Management"]
    },
    {
      title: "Jr Laravel Developer",
      company: "GerMedUSAIT",
      location: "Lahore, Pakistan",
      period: "Jan 2019 - Jul 2020",
      description: "Started career focusing on Laravel development, building foundational skills in backend development and database management.",
      technologies: ["PHP", "Laravel", "MySQL", "Backend Development"]
    }
  ];

  return (
    <section id="experience" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Professional Experience</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-8"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Over 6 years of experience in full-stack development and team leadership
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 animate-fade-in">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="mb-4 md:mb-0">
                      <h3 className="text-xl font-semibold text-primary mb-2">{exp.title}</h3>
                      <div className="flex items-center text-muted-foreground mb-2">
                        <Building className="h-4 w-4 mr-2" />
                        <span className="font-medium">{exp.company}</span>
                        <span className="mx-2">•</span>
                        <span>{exp.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="font-medium">{exp.period}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {exp.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="secondary" className="text-sm">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;

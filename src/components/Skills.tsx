
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code, Database, Globe, Wrench } from 'lucide-react';

const Skills = () => {
  const skillCategories = [
    {
      title: "Frontend Development",
      icon: <Globe className="h-6 w-6" />,
      skills: ["React.js", "Vue.js", "JavaScript", "TypeScript", "HTML5", "CSS3", "Laravel Livewire", "Bootstrap", "Tailwind CSS"]
    },
    {
      title: "Backend Development",
      icon: <Code className="h-6 w-6" />,
      skills: [
      "PHP",
      "Laravel",
      "CodeIgniter",
      "CakePHP",
      "CorePHP",
      "RESTful APIs",
      "Node.js",
      "Express.js",
      "Python",
      "Flask",
      "FastAPI",
      "Streamlit"
      ]
    },
    {
      title: "Database & Storage",
      icon: <Database className="h-6 w-6" />,
      skills: [
      "MySQL",
      "MariaDB",
      "SQLite",
      "MongoDB"
      ]
    },
    {
      title: "Tools & Technologies",
      icon: <Wrench className="h-6 w-6" />,
      skills: [
      "Git",
      "Jenkins",
      "Nginx",
      "Apache",
      "Linux"
      ]
    }
    ];

  const languages = [
    { name: "Urdu", level: "Expert" },
    { name: "English", level: "Intermediate" }
  ];

  return (
    <section id="skills" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Skills & Expertise</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-8"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive technical skills across modern web development technologies
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {skillCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center text-primary">
                    {category.icon}
                    <span className="ml-3">{category.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="outline" className="text-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="animate-slide-in">
            <CardHeader>
              <CardTitle className="text-center">Languages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center space-x-8">
                {languages.map((lang, index) => (
                  <div key={index} className="text-center">
                    <h4 className="font-semibold text-lg">{lang.name}</h4>
                    <p className="text-muted-foreground">{lang.level}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Skills;


import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { GraduationCap, Calendar } from 'lucide-react';

const Education = () => {
  const education = [
    {
      degree: "Bachelor of Arts",
      institution: "University of the Punjab",
      year: "2019",
      description: "Completed undergraduate studies with a focus on comprehensive academic foundation."
    },
    {
      degree: "Intermediate/A-Level",
      institution: "Government College of Sciences Lahore",
      year: "2016",
      subjects: "Computer Science, Mathematical Statistics, Mathematics",
      description: "Specialized in technical subjects that provided strong foundation for software development career."
    },
    {
      degree: "Matriculation/O-Level",
      institution: "Government High School",
      year: "2014",
      subjects: "Biology, Chemistry, Physical Chemistry",
      description: "Strong academic performance in science subjects demonstrating analytical and problem-solving abilities."
    }
  ];

  return (
    <section id="education" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Education</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-8"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Academic foundation that shaped my analytical thinking and problem-solving approach
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {education.map((edu, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 animate-slide-in">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="mb-4 md:mb-0">
                      <h3 className="text-xl font-semibold text-primary mb-2">{edu.degree}</h3>
                      <div className="flex items-center text-muted-foreground mb-2">
                        <GraduationCap className="h-4 w-4 mr-2" />
                        <span className="font-medium">{edu.institution}</span>
                      </div>
                      {edu.subjects && (
                        <p className="text-sm text-muted-foreground">
                          <strong>Subjects:</strong> {edu.subjects}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="font-medium">{edu.year}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {edu.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Github, Linkedin } from 'lucide-react';

const Contact = () => {
  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6" />,
      label: "Phone",
      value: "+92.322.1436408",
      href: "tel:+923221436408"
    },
    {
      icon: <Mail className="h-6 w-6" />,
      label: "Email",
      value: "aliq30292@gmail.com",
      href: "mailto:aliq30292@gmail.com"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      label: "Location",
      value: "Sabzazar, Lahore, Pakistan",
      href: "https://maps.google.com/?q=Sabzazar,Lahore,Pakistan"
    }
  ];

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Get In Touch</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-8"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ready to discuss your next project? Let's connect and explore how we can work together.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {contactInfo.map((contact, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 animate-fade-in">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-full text-primary">
                      {contact.icon}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{contact.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <a 
                    href={contact.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    target={contact.href.startsWith('http') ? '_blank' : undefined}
                    rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {contact.value}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="text-center animate-slide-in">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold mb-6">Ready to Start a Project?</h3>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                I'm always interested in discussing new opportunities and challenging projects. 
                Whether you need a full-stack developer or a team lead, let's talk about how I can help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={() => window.open('mailto:aliq30292@gmail.com', '_blank')}
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Send Email
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => window.open('tel:+923221436408', '_blank')}
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Call Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;

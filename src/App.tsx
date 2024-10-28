import './App.css'
import { useState, useEffect, Suspense } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'

const KNOWN_ARTIFACTS = [
  'artifact-component.tsx'
];

function App() {
  const [selectedComponent, setSelectedComponent] = useState(null)
  const [availableComponents, setAvailableComponents] = useState([])
  const [DynamicComponent, setDynamicComponent] = useState(null)

  useEffect(() => {
    const loadComponents = async () => {
      try {
        const components = KNOWN_ARTIFACTS.map(file => ({
          id: file.replace('.tsx', '').toLowerCase(),
          name: file.replace('.tsx', '')
            .split(/(?=[A-Z])/).join(' '), // Add spaces before capital letters
          file: file
        }));

        setAvailableComponents(components);
      } catch (error) {
        console.error('Error loading components:', error);
      }
    };

    loadComponents();
  }, []);

  useEffect(() => {
    if (!selectedComponent) return;

    const loadComponent = async () => {
      try {
        // Using dynamic import with relative path
        const Component = (await import(`./artifacts/${selectedComponent}.tsx`)).default;
        setDynamicComponent(() => Component);
      } catch (error) {
        console.error('Error loading component:', error);
        setDynamicComponent(null);
      }
    };

    loadComponent();
  }, [selectedComponent]);

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <Card className="mb-4">
        <CardContent className="pt-6">
          <Select value={selectedComponent} onValueChange={setSelectedComponent}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select an artifact to display" />
            </SelectTrigger>
            <SelectContent>
              {availableComponents.map(({ id, name }) => (
                <SelectItem key={id} value={id}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Suspense fallback={
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }>
        {DynamicComponent && <DynamicComponent />}
      </Suspense>
    </div>
  )
}

export default App

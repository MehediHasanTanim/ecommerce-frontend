import { Card, CardHeader, CardContent } from "@/components/ui/Card";

export default function ProfilePage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">My Profile</h1>
      <Card>
        <CardHeader><h2 className="text-xl font-semibold">Personal Information</h2></CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-gray-500 font-medium">Name</div>
              <div className="col-span-2">John Doe</div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-gray-500 font-medium">Email</div>
              <div className="col-span-2">john@example.com</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

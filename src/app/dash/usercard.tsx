import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface UserCardProps {
  name: string;
  username: string;
  jams: number;
}

export default function UserCard({ name, username, jams }: UserCardProps) {
  return (
    <div className="absolute pt-5 pl-5 w-[20vw]">
      <Card>
        <CardHeader>
          <p>{name}</p>
        </CardHeader>
        <CardContent>
          <p>{username}</p>
          <p>{jams} jams</p>
        </CardContent>
      </Card>
    </div>
  );
}

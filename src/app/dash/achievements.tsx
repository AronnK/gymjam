import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function AchievementsCard() {
  return (
    <div className="pt-5 pl-5 w-[20vw]">
      <Card className="h-[54vh]">
        <CardHeader>
          <p>Achievements</p>
        </CardHeader>
        <CardContent>
          <p> Recent Prs</p>
          <p>Badges</p>
        </CardContent>
        <CardFooter>share on other public platforms</CardFooter>
      </Card>
    </div>
  );
}

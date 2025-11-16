import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollText } from "lucide-react"

const BalanceSheet = ({ balances }) => {
  return (
    <Drawer>
      {/* scroll icon button */}
        <DrawerTrigger asChild>
          <Button variant="outline">
            <ScrollText />
          </Button>
        </DrawerTrigger>

        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Expense</DrawerTitle>
            <DrawerDescription>
             
            </DrawerDescription>
          </DrawerHeader>


          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
           
          </DrawerFooter>
        </DrawerContent>
     
    </Drawer>
  )
}

export default BalanceSheet

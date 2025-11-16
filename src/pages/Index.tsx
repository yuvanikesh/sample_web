import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Trash2, Plus, Heart } from "lucide-react";
import { toast } from "sonner";

interface WishlistItem {
  id: string;
  text: string;
  completed: boolean;
}

const Index = () => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [newItem, setNewItem] = useState("");

  // Load items from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("wishlist");
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  // Save items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(items));
  }, [items]);

  const addItem = () => {
    if (!newItem.trim()) {
      toast.error("Please enter an item");
      return;
    }

    const item: WishlistItem = {
      id: Date.now().toString(),
      text: newItem.trim(),
      completed: false,
    };

    setItems([...items, item]);
    setNewItem("");
    toast.success("Item added to wishlist!");
  };

  const toggleItem = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const deleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
    toast.success("Item removed");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addItem();
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-lg">
            <Heart className="w-8 h-8 text-primary-foreground" fill="currentColor" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            My Wishlist
          </h1>
          <p className="text-muted-foreground text-lg">
            Keep track of everything you wish for
          </p>
        </div>

        {/* Add Item Section */}
        <Card className="p-6 mb-8 shadow-lg">
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="Add a new wish..."
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 text-base"
            />
            <Button 
              onClick={addItem}
              size="lg"
              className="px-6"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add
            </Button>
          </div>
        </Card>

        {/* Wishlist Items */}
        <div className="space-y-3">
          {items.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="text-muted-foreground">
                <Heart className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-lg">Your wishlist is empty</p>
                <p className="text-sm mt-2">Start adding items you wish for!</p>
              </div>
            </Card>
          ) : (
            items.map((item) => (
              <Card
                key={item.id}
                className="p-5 transition-all duration-300 hover:shadow-md group"
              >
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={() => toggleItem(item.id)}
                    className="w-5 h-5"
                  />
                  <span
                    className={`flex-1 text-base transition-all duration-300 ${
                      item.completed
                        ? "line-through text-muted-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {item.text}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Stats */}
        {items.length > 0 && (
          <div className="mt-8 text-center text-sm text-muted-foreground">
            {items.filter((i) => i.completed).length} of {items.length} items obtained
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;

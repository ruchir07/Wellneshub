import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Plus, ArrowUp, ArrowDown, Book, Brain, Heart, Users, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

const postFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  category: z.enum(["general", "books", "study-tips", "mental-health", "campus-life"]),
});

const commentFormSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
});

interface ForumPost {
  id: string;
  title: string;
  content: string;
  category: string;
  votes: number;
  created_at: string;
  user_id: string;
  profiles?: {
    anonymous_username: string;
  } | null;
}

interface ForumComment {
  id: string;
  content: string;
  votes: number;
  created_at: string;
  user_id: string;
  profiles?: {
    anonymous_username: string;
  } | null;
}

const categoryIcons = {
  general: Users,
  books: Book,
  "study-tips": Brain,
  "mental-health": Heart,
  "campus-life": MessageSquare,
};

const categoryColors = {
  general: "default",
  books: "secondary",
  "study-tips": "outline",
  "mental-health": "destructive",
  "campus-life": "default",
} as const;

export default function CommunityForum() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [showNewPostDialog, setShowNewPostDialog] = useState(false);
  const [showPostDialog, setShowPostDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const postForm = useForm<z.infer<typeof postFormSchema>>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "general",
    },
  });

  const commentForm = useForm<z.infer<typeof commentFormSchema>>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      content: "",
    },
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("forum_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch posts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from("forum_comments")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch comments. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onSubmitPost = async (values: z.infer<typeof postFormSchema>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to create posts.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("forum_posts").insert({
        title: values.title,
        content: values.content,
        category: values.category,
        user_id: user.id,
      });

      if (error) throw error;

      toast({
        title: "Post created",
        description: "Your post has been published to the community.",
      });

      postForm.reset();
      setShowNewPostDialog(false);
      fetchPosts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onSubmitComment = async (values: z.infer<typeof commentFormSchema>) => {
    if (!selectedPost) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to comment.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("forum_comments").insert({
        content: values.content,
        post_id: selectedPost.id,
        user_id: user.id,
      });

      if (error) throw error;

      toast({
        title: "Comment added",
        description: "Your comment has been posted.",
      });

      commentForm.reset();
      fetchComments(selectedPost.id);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openPost = (post: ForumPost) => {
    setSelectedPost(post);
    setShowPostDialog(true);
    fetchComments(post.id);
  };

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    const matchesSearch = searchTerm === "" || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto p-6">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading community posts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <MessageSquare className="h-10 w-10 text-primary" />
              Community Forum
            </h1>
            <p className="text-muted-foreground mt-2">
              Connect with peers, share experiences, and support each other
            </p>
          </div>

          <Dialog open={showNewPostDialog} onOpenChange={setShowNewPostDialog}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
                <DialogDescription>
                  Share your thoughts, questions, or experiences with the community.
                </DialogDescription>
              </DialogHeader>
              <Form {...postForm}>
                <form onSubmit={postForm.handleSubmit(onSubmitPost)} className="space-y-4">
                  <FormField
                    control={postForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="What's on your mind?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={postForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="general">General Discussion</SelectItem>
                            <SelectItem value="books">Books & Reading</SelectItem>
                            <SelectItem value="study-tips">Study Tips</SelectItem>
                            <SelectItem value="mental-health">Mental Health</SelectItem>
                            <SelectItem value="campus-life">Campus Life</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={postForm.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Share your thoughts, experiences, or questions..." 
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setShowNewPostDialog(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Post</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="sm:w-[200px]">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="books">Books</SelectItem>
              <SelectItem value="study-tips">Study Tips</SelectItem>
              <SelectItem value="mental-health">Mental Health</SelectItem>
              <SelectItem value="campus-life">Campus Life</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Posts Grid */}
        <div className="grid gap-6">
          {filteredPosts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm || selectedCategory !== "all" 
                    ? "No posts found matching your criteria." 
                    : "No posts yet. Be the first to start a conversation!"
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredPosts.map((post) => {
              const IconComponent = categoryIcons[post.category as keyof typeof categoryIcons];
              return (
                <Card key={post.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => openPost(post)}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={categoryColors[post.category as keyof typeof categoryColors]}>
                            <IconComponent className="h-3 w-3 mr-1" />
                            {post.category.replace("-", " ")}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl hover:text-primary transition-colors">
                          {post.title}
                        </CardTitle>
                      </div>
                    </div>
                    <CardDescription className="line-clamp-3">
                      {post.content}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              A
                            </AvatarFallback>
                          </Avatar>
                            <span className="text-sm text-muted-foreground">
                              Anonymous User
                            </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="gap-1">
                          <ArrowUp className="h-4 w-4" />
                          {post.votes}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Post Detail Modal */}
        <Dialog open={showPostDialog} onOpenChange={setShowPostDialog}>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            {selectedPost && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={categoryColors[selectedPost.category as keyof typeof categoryColors]}>
                      {categoryIcons[selectedPost.category as keyof typeof categoryIcons] && 
                        React.createElement(categoryIcons[selectedPost.category as keyof typeof categoryIcons], { className: "h-3 w-3 mr-1" })
                      }
                      {selectedPost.category.replace("-", " ")}
                    </Badge>
                  </div>
                  <DialogTitle className="text-left">{selectedPost.title}</DialogTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        A
                      </AvatarFallback>
                    </Avatar>
                      <span>{selectedPost.profiles?.anonymous_username || "Anonymous"}</span>
                    </div>
                    <span>{formatDistanceToNow(new Date(selectedPost.created_at), { addSuffix: true })}</span>
                  </div>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap">{selectedPost.content}</p>
                  </div>

                  <div className="flex items-center gap-2 border-t pt-4">
                    <Button variant="ghost" size="sm" className="gap-1">
                      <ArrowUp className="h-4 w-4" />
                      {selectedPost.votes}
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Comments Section */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Comments ({comments.length})</h3>
                    
                    {/* Add Comment Form */}
                    <Form {...commentForm}>
                      <form onSubmit={commentForm.handleSubmit(onSubmitComment)} className="space-y-3">
                        <FormField
                          control={commentForm.control}
                          name="content"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea 
                                  placeholder="Add a comment..." 
                                  className="min-h-[80px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex justify-end">
                          <Button type="submit" size="sm">Post Comment</Button>
                        </div>
                      </form>
                    </Form>

                    {/* Comments List */}
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <div key={comment.id} className="border-l-2 border-muted pl-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="text-xs">
                                A
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">
                              Anonymous User
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap mb-2">{comment.content}</p>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" className="gap-1 h-6 px-2">
                              <ArrowUp className="h-3 w-3" />
                              {comment.votes}
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-1 h-6 px-2">
                              <ArrowDown className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {comments.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No comments yet. Be the first to comment!
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
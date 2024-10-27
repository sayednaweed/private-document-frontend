export default function CustomLoader() {
  return (
    <div className="bg-primary/50 p-2 rounded-full flex space-x-3">
      <div className="w-2 h-2 mt-1 duration-1000 delay-100 bg-primary-foreground ease-in rounded-full animate-bounce" />
      <div className="w-2 h-2 mt-1 duration-1000 delay-300 bg-primary-foreground ease-in rounded-full animate-bounce" />
      <div className="w-2 h-2 mt-1 duration-1000 delay-500 bg-primary-foreground ease-in rounded-full animate-bounce" />
    </div>
  );
}

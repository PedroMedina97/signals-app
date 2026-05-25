# Section 7: Angular Resource APIs - Modern State Management

This section demonstrates the modern **Resource APIs** introduced in Angular 19+, showcasing advanced patterns for reactive data fetching and state management with Angular Signals.

## 📚 Topics Covered

### 1. **Getting Started with the `resource()` Function**
- Basic setup and configuration
- Promise-based async data loading
- Automatic dependency tracking with signals

### 2. **Reloading Status and isLoading Signals**
- `status()` signal for tracking resource state
- `isLoading()` signal for loading indicators
- Real-time status monitoring

### 3. **Reloading a Resource**
- Using the `reload()` method to refresh data
- Triggering manual data refetches
- Maintaining state consistency

### 4. **Setting Local Values to a Resource**
- Using `set()` method for local value updates
- Bypassing async loaders for immediate updates
- Optimistic UI patterns

### 5. **Using AbortSignal in Promise-based APIs**
- Automatic request cancellation
- Preventing memory leaks
- Proper cleanup with `params.abortSignal`

### 6. **Resources with Parameters**
- Reactive parameters using signals
- Automatic reloading on parameter changes
- Dynamic query building

### 7. **Error Handling in Resources**
- Using `error()` signal for error states
- Graceful error recovery
- User-friendly error messages

### 8. **Books Store Application**
- Complete state management service
- Centralized data fetching
- Shared resources across components

### 9. **State Service Integration**
- Service-based resource management
- Dependency injection with `inject()`
- Modular architecture

### 10. **Current Keyword State Signal**
- Reactive search functionality
- Debounced input handling
- Dynamic filtering

### 11. **Using `resource()` with `fetch()` for HTTP Requests**
- Native fetch API integration
- RESTful API consumption
- Response parsing and error handling

### 12. **Using linkedSignal for selectedBookId**
- Derived writable signals
- Synchronized state management
- Parent-child signal relationships

### 13. **Working with Observables (toSignal alternative to rxResource)**
- Converting RxJS observables to signals
- Integration with Angular HttpClient
- Automatic subscription management

### 14. **Streaming with resource() and WebSockets**
- Promise-based WebSocket connections
- Real-time message streaming
- Connection cleanup

### 15. **Streaming with toSignal() and Observables**
- Observable-based real-time updates
- Stock price simulation
- Continuous data streams

## 🎯 Key Features Demonstrated

### Resource API Methods
- `resource()` - Create a new resource
- `.value()` - Access current data
- `.status()` - Get loading/success/error state
- `.isLoading()` - Check loading state
- `.error()` - Access error information
- `.reload()` - Manually refresh data
- `.set()` - Set local value

### Signal Types Used
- `signal()` - Basic writable signals
- `linkedSignal()` - Derived writable signals
- `toSignal()` - Observable to signal conversion

### Modern Patterns
- ✅ Automatic dependency tracking
- ✅ Reactive parameter updates
- ✅ Promise and Observable support
- ✅ Built-in error handling
- ✅ Loading state management
- ✅ Request cancellation
- ✅ Memory leak prevention
- ✅ Type safety with TypeScript
- ✅ Standalone components
- ✅ Dependency injection with `inject()`

## 🏗️ Project Structure

```
seccion7/
├── seccion7.ts              # Main component with all examples
├── seccion7.html            # Template with explanatory comments
├── seccion7.scss            # Styled components
└── services/
    └── book-store.service.ts # State management service
```

## 📖 Examples Breakdown

### Example 1: Basic Resource with Fetch
Demonstrates basic `resource()` usage with the native Fetch API, showing how to:
- Create a resource
- Use AbortSignal for cancellation
- Track loading states
- Handle errors

### Example 2: Resources with Parameters
Shows dynamic resources that react to signal changes:
- Reactive search queries
- Parameter validation
- Error boundary handling
- Manual reload and local value setting

### Example 3: Observable Integration
Converts RxJS observables to resources:
- Category-based filtering
- Promise wrapper for observables
- Clean subscription management

### Example 4: LinkedSignal Usage
Demonstrates derived writable signals:
- Automatic initialization from parent signal
- Manual override capability
- Detail view synchronization

### Example 5: WebSocket Streaming (Promise)
Promise-based streaming example:
- Simulated WebSocket connection
- Message batching
- Proper cleanup with AbortSignal

### Example 6: Real-time Streaming (Observable)
Observable-based streaming:
- Stock price simulation
- Continuous updates with `toSignal()`
- Automatic subscription cleanup

### Example 7: State Service
Centralized state management:
- Shared resources across components
- Keyword-based search
- Debounced input handling

## 🚀 Running the Examples

1. Navigate to Section 7 in the application
2. Each example is interactive with controls
3. Observe the loading states and data updates
4. Check error handling by entering invalid inputs
5. Test reload functionality with the provided buttons

## 💡 Best Practices Demonstrated

1. **Signal-first architecture**: Use signals for all reactive state
2. **Resource pattern**: Centralize async operations in resources
3. **Error boundaries**: Always handle errors gracefully
4. **Loading states**: Provide feedback during async operations
5. **Cleanup**: Use AbortSignal for proper cancellation
6. **Type safety**: Leverage TypeScript for better DX
7. **Service layer**: Separate concerns with dedicated services
8. **Debouncing**: Optimize frequent operations
9. **Reusability**: Create reusable resource patterns

## 🔄 Migration Notes

For projects upgrading from older Angular versions:
- Replace `HttpClient` observables with resources where appropriate
- Convert `async` pipe usage to `resource()` + signals
- Migrate manual subscription management to automatic cleanup
- Use `toSignal()` for gradual migration from observables

## 📝 Notes

- This section uses Angular 21.2.0 features
- All examples are fully typed with TypeScript
- Components are standalone (no NgModule required)
- Proper cleanup is handled automatically
- Memory leaks are prevented through signal lifecycle

## 🎓 Learning Outcomes

After studying this section, you will understand:
- How to use the modern Resource API
- When to choose resources over traditional approaches
- How to handle async operations reactively
- Error handling and loading state patterns
- Integration with external APIs
- State management with services
- Real-time data streaming
- Signal-based reactive programming

---

**Author**: Angular Signals Learning Path  
**Version**: 1.0.0  
**Last Updated**: May 2026

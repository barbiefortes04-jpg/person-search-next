'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Play, CheckCircle2, XCircle, Loader2, Copy, Check, RefreshCw, Trash2, Edit } from 'lucide-react'
import { toast } from 'sonner'

interface Person {
  id: string
  name: string
  email: string
  phoneNumber: string
  createdAt: string
}

export default function McpDemoPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Record<string, unknown> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [people, setPeople] = useState<Person[]>([])
  const [loadingPeople, setLoadingPeople] = useState(false)
  const [activeTab, setActiveTab] = useState('view')

  // Create Person
  const [createName, setCreateName] = useState('')
  const [createEmail, setCreateEmail] = useState('')
  const [createPhone, setCreatePhone] = useState('')

  // Get Person
  const [personId, setPersonId] = useState('')

  // Update Person
  const [updateId, setUpdateId] = useState('')
  const [updateName, setUpdateName] = useState('')
  const [updateEmail, setUpdateEmail] = useState('')
  const [updatePhone, setUpdatePhone] = useState('')

  // Delete Person
  const [deleteId, setDeleteId] = useState('')

  // Load people list on mount and after mutations
  const loadPeople = async () => {
    setLoadingPeople(true)
    try {
      const response = await fetch('/api/mcp/people')
      const result = await response.json()
      if (response.ok && result.data) {
        setPeople(result.data)
      }
    } catch {
      console.error('Failed to load people')
    } finally {
      setLoadingPeople(false)
    }
  }

  useEffect(() => {
    loadPeople()
  }, [])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    // Clear results when switching tabs
    setResult(null)
    setError(null)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy')
    }
  }

  const handleApiCall = async (endpoint: string, method: string, body?: Record<string, unknown>) => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Request failed')
        toast.error(data.error || 'Request failed')
      } else {
        setResult(data)
        toast.success('Operation completed successfully!')
        // Refresh people list after mutations
        if (['POST', 'PUT', 'DELETE'].includes(method)) {
          loadPeople()
          // Clear form fields on success
          if (method === 'POST') {
            setCreateName('')
            setCreateEmail('')
            setCreatePhone('')
          }
        }
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const fillUpdateForm = (person: Person) => {
    setUpdateId(person.id)
    setUpdateName(person.name)
    setUpdateEmail(person.email)
    setUpdatePhone(person.phoneNumber)
    toast.success('Form filled with ' + person.name)
  }

  const fillDeleteForm = (personId: string) => {
    setDeleteId(personId)
    toast.success('ID copied to delete form')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2">MCP Server Demo</h1>
      <p className="text-muted-foreground mb-8">
        Test the MCP API endpoints that Claude Desktop uses to perform CRUD operations
      </p>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="view">View All</TabsTrigger>
          <TabsTrigger value="list">List API</TabsTrigger>
          <TabsTrigger value="create">Create</TabsTrigger>
          <TabsTrigger value="get">Get One</TabsTrigger>
          <TabsTrigger value="update">Update</TabsTrigger>
          <TabsTrigger value="delete">Delete</TabsTrigger>
        </TabsList>

        {/* View All People (Interactive Table) */}
        <TabsContent value="view">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All People</CardTitle>
                  <CardDescription>Interactive view of all person records</CardDescription>
                </div>
                <Button
                  onClick={loadPeople}
                  disabled={loadingPeople}
                  variant="outline"
                  size="sm"
                >
                  {loadingPeople ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  <span className="ml-2">Refresh</span>
                </Button>
              </div>
              <Badge variant="secondary" className="w-fit mt-2">
                {people.length} {people.length === 1 ? 'record' : 'records'}
              </Badge>
            </CardHeader>
            <CardContent>
              {loadingPeople ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : people.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No people found in the database.</p>
                  <p className="text-sm mt-2">Create some people to get started!</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>ID</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {people.map((person) => (
                        <TableRow key={person.id}>
                          <TableCell className="font-medium">{person.name}</TableCell>
                          <TableCell>{person.email}</TableCell>
                          <TableCell>{person.phoneNumber}</TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            {person.id.slice(0, 8)}...
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                onClick={() => copyToClipboard(person.id)}
                                variant="ghost"
                                size="sm"
                                title="Copy ID"
                              >
                                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                              </Button>
                              <Button
                                onClick={() => fillUpdateForm(person)}
                                variant="ghost"
                                size="sm"
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => fillDeleteForm(person.id)}
                                variant="ghost"
                                size="sm"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* List All People */}
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>List All People</CardTitle>
              <CardDescription>Fetch all person records from the database</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => handleApiCall('/api/mcp/people', 'GET')}
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                Fetch All People
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Create Person */}
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New Person</CardTitle>
              <CardDescription>Add a new person to the database</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="create-name">Name</Label>
                <Input
                  id="create-name"
                  placeholder="John Doe"
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-email">Email</Label>
                <Input
                  id="create-email"
                  type="email"
                  placeholder="john@example.com"
                  value={createEmail}
                  onChange={(e) => setCreateEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-phone">Phone Number</Label>
                <Input
                  id="create-phone"
                  placeholder="0412345678"
                  value={createPhone}
                  onChange={(e) => setCreatePhone(e.target.value)}
                />
              </div>
              <Button 
                onClick={() => handleApiCall('/api/mcp/people', 'POST', {
                  name: createName,
                  email: createEmail,
                  phoneNumber: createPhone,
                })}
                disabled={loading || !createName || !createEmail || !createPhone}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                Create Person
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Get Person */}
        <TabsContent value="get">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Get Person by ID</CardTitle>
                <CardDescription>Retrieve a specific person&apos;s details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="person-id">Person ID</Label>
                  <Input
                    id="person-id"
                    placeholder="Enter person ID"
                    value={personId}
                    onChange={(e) => setPersonId(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={() => handleApiCall(`/api/mcp/people/${personId}`, 'GET')}
                  disabled={loading || !personId}
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                  Get Person
                </Button>
              </CardContent>
            </Card>
            
            {/* ID Reference Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Available Person IDs</CardTitle>
                <CardDescription>Click to copy an ID</CardDescription>
              </CardHeader>
              <CardContent>
                {people.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No people found</p>
                ) : (
                  <div className="grid gap-2">
                    {people.map((person) => (
                      <div key={person.id} className="flex items-center justify-between p-2 border rounded hover:bg-muted/50">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{person.name}</p>
                          <p className="text-xs font-mono text-muted-foreground">{person.id}</p>
                        </div>
                        <Button
                          onClick={() => {
                            setPersonId(person.id)
                            copyToClipboard(person.id)
                          }}
                          variant="ghost"
                          size="sm"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Update Person */}
        <TabsContent value="update">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Update Person</CardTitle>
                <CardDescription>Modify an existing person&apos;s information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="update-id">Person ID</Label>
                  <Input
                    id="update-id"
                    placeholder="Enter person ID"
                    value={updateId}
                    onChange={(e) => setUpdateId(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="update-name">New Name (optional)</Label>
                  <Input
                    id="update-name"
                    placeholder="John Doe"
                    value={updateName}
                    onChange={(e) => setUpdateName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="update-email">New Email (optional)</Label>
                  <Input
                    id="update-email"
                    type="email"
                    placeholder="john@example.com"
                    value={updateEmail}
                    onChange={(e) => setUpdateEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="update-phone">New Phone (optional)</Label>
                  <Input
                    id="update-phone"
                    placeholder="0412345678"
                    value={updatePhone}
                    onChange={(e) => setUpdatePhone(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={() => handleApiCall(`/api/mcp/people/${updateId}`, 'PUT', {
                    ...(updateName && { name: updateName }),
                    ...(updateEmail && { email: updateEmail }),
                    ...(updatePhone && { phoneNumber: updatePhone }),
                  })}
                  disabled={loading || !updateId || (!updateName && !updateEmail && !updatePhone)}
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                  Update Person
                </Button>
              </CardContent>
            </Card>
            
            {/* ID Reference Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Quick Edit - Select a Person</CardTitle>
                <CardDescription>Click Edit to auto-fill the form above</CardDescription>
              </CardHeader>
              <CardContent>
                {people.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No people found</p>
                ) : (
                  <div className="grid gap-2">
                    {people.map((person) => (
                      <div key={person.id} className="flex items-center justify-between p-2 border rounded hover:bg-muted/50">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{person.name}</p>
                          <p className="text-xs text-muted-foreground">{person.email} • {person.phoneNumber}</p>
                        </div>
                        <Button
                          onClick={() => fillUpdateForm(person)}
                          variant="outline"
                          size="sm"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Delete Person */}
        <TabsContent value="delete">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Delete Person</CardTitle>
                <CardDescription>Remove a person from the database</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="delete-id">Person ID</Label>
                  <Input
                    id="delete-id"
                    placeholder="Enter person ID"
                    value={deleteId}
                    onChange={(e) => setDeleteId(e.target.value)}
                  />
                </div>
                <Alert>
                  <AlertDescription>
                    <strong>Warning:</strong> This action cannot be undone.
                  </AlertDescription>
                </Alert>
                <Button 
                  variant="destructive"
                  onClick={() => handleApiCall(`/api/mcp/people/${deleteId}`, 'DELETE')}
                  disabled={loading || !deleteId}
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                  Delete Person
                </Button>
              </CardContent>
            </Card>
            
            {/* ID Reference Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Select a Person to Delete</CardTitle>
                <CardDescription>Click Delete to auto-fill the ID above</CardDescription>
              </CardHeader>
              <CardContent>
                {people.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No people found</p>
                ) : (
                  <div className="grid gap-2">
                    {people.map((person) => (
                      <div key={person.id} className="flex items-center justify-between p-2 border rounded hover:bg-muted/50">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{person.name}</p>
                          <p className="text-xs text-muted-foreground">{person.email}</p>
                        </div>
                        <Button
                          onClick={() => fillDeleteForm(person.id)}
                          variant="outline"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4 mr-1 text-destructive" />
                          Delete
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Results Display */}
      {(result || error) && (
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {error ? (
                  <>
                    <XCircle className="h-5 w-5 text-destructive" />
                    Error
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    Success
                  </>
                )}
              </CardTitle>
              {result && (
                <Button
                  onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}
                  variant="outline"
                  size="sm"
                >
                  {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  Copy Response
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Response</Badge>
                  {result && 'count' in result && typeof result.count === 'number' && (
                    <Badge>{result.count} record(s)</Badge>
                  )}
                </div>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

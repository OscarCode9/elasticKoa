const router = require('koa-router')()
router.prefix('/employees')

router.get('/getAllEmployees', async function getAllEmployee(ctx, next) {
	try {
		const {
			count
		} = await ctx.client.count()
		const response = await ctx.client.search({
			index: 'employees',
			body: {
				query: {
					match_all: {}
				}
			},
			size: count
		})
		ctx.status = 200
		ctx.body = response

	} catch (error) {
		ctx.throw(400, 'bad request', {
			error
		})
	}

})

router.post('/addEmployee', async function addEmployee(ctx, next) {
	const employee = ctx.request.body
	try {
		const newEmployee = await ctx.client.index({
			index: 'employees',
			type: 'employee',
			body: employee
		});
		ctx.status = 201
		ctx.body = {
			newEmployee,
			employee
		}

	} catch (error) {
		ctx.throw(400, 'bad request', {
			error
		})
	}
})

router.delete('/deleteEmployeeById/:employeeId', async function deleteEmployeeById(ctx, next) {
	const employeeId = ctx.params.employeeId
	try {
		const deleteEmployee = await ctx.client.deleteByQuery({
			index: 'employees',
			body: {
				query: {
					term: {
						_id: employeeId
					}
				}
			}
		})

		ctx.status = 200
		ctx.body = deleteEmployee

	} catch (error) {
		ctx.throw(400, 'bad request', {
			error
		})
	}
})

router.get('/getEmployeeById/:employeeId', async function getEmployeeById(ctx, next) {
	const employeeId = ctx.params.employeeId
	try {
		const employee = await ctx.client.search({
			index: 'employees',
			body: {
				query: {
					match: {
						_id: employeeId
					}
				}
			}
		})
		ctx.status = 200
		ctx.body = employee
	} catch (error) {
		ctx.throw(400, 'bad request', {
			error
		})
	}
})

router.put('/updateEmployeeByUserName/:employeeId', async function updateEmployeeByUserName(ctx, next) {
	const employee = ctx.request.body
	const employeeId = ctx.params.employeeId
	try {
		const updateEmployee = await ctx.client.index({
			index: 'employees',
			type: 'employee',
			id: employeeId,
			body: employee
		});
		ctx.status = 201
		ctx.body = {
			updateEmployee,
			employee
		}

	} catch (error) {
		ctx.throw(400, 'bad request', {
			error
		})
	}
})

module.exports = router